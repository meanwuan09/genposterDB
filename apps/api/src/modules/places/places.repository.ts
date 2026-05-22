import { Injectable } from '@nestjs/common';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import type { Place, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { AttachPlaceMediaInput, CreatePlaceInput, ListPlacesQuery, PlaceSort, SortOrder, UpdatePartnerInput, UpdatePlaceInput } from './places.types';

const ownerTypes = ['place', 'places', 'Place'];
const allowedSort = new Set<PlaceSort>(['name', 'updatedAt', 'createdAt', 'partnerPriority', 'categoryId', 'district', 'priceMin']);

@Injectable()
export class PlacesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListPlacesQuery) {
    const page = Math.max(1, Number(query.page ?? 1));
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize ?? 25)));
    const where = this.buildWhere(query);
    const sort = allowedSort.has(query.sort as PlaceSort) ? (query.sort as PlaceSort) : 'updatedAt';
    const order: SortOrder = query.order === 'asc' ? 'asc' : 'desc';

    const [places, total] = await this.prisma.$transaction([
      this.prisma.place.findMany({
        where,
        orderBy: [{ [sort]: order }, { id: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize
      }),
      this.prisma.place.count({ where })
    ]);

    return { items: await this.hydratePlaces(places), total, page, pageSize };
  }

  async findById(id: number) {
    const place = await this.prisma.place.findUnique({ where: { id } });
    if (!place) return null;
    return (await this.hydratePlaces([place], true))[0];
  }

  async create(input: CreatePlaceInput, actorUserId: number) {
    const lastPlace = await this.prisma.place.findFirst({ orderBy: { id: 'desc' }, select: { id: true } });
    const place = await this.prisma.place.create({
      data: {
        ...input,
        id: (lastPlace?.id ?? 0) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByUserId: actorUserId,
        updatedByUserId: actorUserId
      }
    });

    return this.findById(place.id);
  }

  async update(id: number, input: UpdatePlaceInput, actorUserId: number) {
    const place = await this.prisma.place.update({
      where: { id },
      data: { ...input, updatedAt: new Date(), updatedByUserId: actorUserId }
    });

    return this.findById(place.id);
  }

  async updatePartner(id: number, input: UpdatePartnerInput, actorUserId: number) {
    const place = await this.prisma.place.update({
      where: { id },
      data: { ...input, updatedAt: new Date(), updatedByUserId: actorUserId }
    });

    return this.findById(place.id);
  }

  listAvailableMedia(q?: string) {
    return this.prisma.mediaFile.findMany({
      where: q
        ? {
            OR: [
              { originalName: { contains: q, mode: 'insensitive' } },
              { publicPath: { contains: q, mode: 'insensitive' } }
            ]
          }
        : undefined,
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: 100,
      select: { id: true, originalName: true, publicPath: true, mimeType: true, width: true, height: true }
    });
  }

  async attachMedia(placeId: number, input: AttachPlaceMediaInput, actorUserId: number) {
    const lastMedia = await this.prisma.placeMedia.findFirst({ orderBy: { id: 'desc' }, select: { id: true } });

    if (input.isPrimary) {
      await this.prisma.placeMedia.updateMany({
        where: { ownerType: { in: ownerTypes }, ownerId: placeId },
        data: { isPrimary: false }
      });
    }

    await this.prisma.placeMedia.create({
      data: {
        id: (lastMedia?.id ?? 0) + 1,
        ownerType: 'place',
        ownerId: placeId,
        mediaFileId: input.mediaFileId,
        sortOrder: input.sortOrder ?? 0,
        isPrimary: input.isPrimary ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByUserId: actorUserId,
        updatedByUserId: actorUserId
      }
    });

    return this.findById(placeId);
  }

  async uploadMedia(placeId: number, file: Express.Multer.File, actorUserId: number) {
    const extension = path.extname(file.originalname) || '.jpg';
    const safeName = `${Date.now()}-${file.originalname.replace(/[^\p{L}\p{N}._-]+/gu, '-')}`;
    const existingMedia = await this.prisma.placeMedia.findFirst({
      where: { ownerType: { in: ownerTypes }, ownerId: placeId },
      orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }, { id: 'asc' }]
    });
    const existingFile = existingMedia ? await this.prisma.mediaFile.findUnique({ where: { id: existingMedia.mediaFileId } }) : null;
    const folder = existingFile?.publicPath ? path.posix.dirname(existingFile.publicPath) : path.posix.join('accset', 'uploads', `place-${placeId}`);
    const relativePath = path.posix.join(folder, safeName.endsWith(extension) ? safeName : `${safeName}${extension}`);
    const absolutePath = path.resolve(process.cwd(), '../../', relativePath);

    await mkdir(path.dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, file.buffer);

    const [lastMediaFile, lastPlaceMedia] = await this.prisma.$transaction([
      this.prisma.mediaFile.findFirst({ orderBy: { id: 'desc' }, select: { id: true } }),
      this.prisma.placeMedia.findFirst({ orderBy: { id: 'desc' }, select: { id: true } })
    ]);

    const mediaFile = await this.prisma.mediaFile.create({
      data: {
        id: (lastMediaFile?.id ?? 0) + 1,
        driveFileId: `upload-${Date.now()}`,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        publicPath: relativePath,
        status: 'uploaded',
        downloadedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByUserId: actorUserId,
        updatedByUserId: actorUserId
      }
    });

    await this.prisma.placeMedia.create({
      data: {
        id: (lastPlaceMedia?.id ?? 0) + 1,
        ownerType: 'place',
        ownerId: placeId,
        mediaFileId: mediaFile.id,
        sortOrder: 0,
        isPrimary: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdByUserId: actorUserId,
        updatedByUserId: actorUserId
      }
    });

    return this.findById(placeId);
  }

  async deleteMedia(placeId: number, ids: number[]) {
    const placeMedia = await this.prisma.placeMedia.findMany({
      where: { id: { in: ids }, ownerType: { in: ownerTypes }, ownerId: placeId }
    });
    const mediaFileIds = [...new Set(placeMedia.map((media) => media.mediaFileId))];
    const mediaFiles = mediaFileIds.length ? await this.prisma.mediaFile.findMany({ where: { id: { in: mediaFileIds } } }) : [];

    await this.prisma.placeMedia.deleteMany({
      where: { id: { in: ids }, ownerType: { in: ownerTypes }, ownerId: placeId }
    });

    for (const mediaFile of mediaFiles) {
      const usageCount = await this.prisma.placeMedia.count({ where: { mediaFileId: mediaFile.id } });
      if (usageCount === 0) {
        await this.deletePhysicalMediaFile(mediaFile.publicPath);
        await this.prisma.mediaFile.delete({ where: { id: mediaFile.id } }).catch(() => undefined);
      }
    }

    return this.findById(placeId);
  }

  private async deletePhysicalMediaFile(publicPath: string | null) {
    if (!publicPath || publicPath.startsWith('http://') || publicPath.startsWith('https://')) return;

    const root = path.resolve(process.cwd(), '../../');
    const filePath = path.resolve(root, publicPath);

    if (!filePath.startsWith(root + path.sep)) return;

    await rm(filePath, { force: true }).catch(() => undefined);
  }

  private buildWhere(query: ListPlacesQuery): Prisma.PlaceWhereInput {
    const where: Prisma.PlaceWhereInput = {};

    if (query.categoryId) where.categoryId = Number(query.categoryId);
    if (query.isActive === 'true') where.isActive = true;
    if (query.isActive === 'false') where.isActive = false;

    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: 'insensitive' } },
        { address: { contains: query.q, mode: 'insensitive' } },
        { district: { contains: query.q, mode: 'insensitive' } },
        { city: { contains: query.q, mode: 'insensitive' } },
        { highlights: { contains: query.q, mode: 'insensitive' } },
        { note: { contains: query.q, mode: 'insensitive' } }
      ];
    }

    return where;
  }

  private async hydratePlaces(places: Place[], includeTags = false) {
    if (places.length === 0) return [];

    const placeIds = places.map((place) => place.id);
    const categoryIds = [...new Set(places.map((place) => place.categoryId))];
    const userIds = [...new Set(places.flatMap((place) => [place.createdByUserId, place.updatedByUserId]).filter((id): id is number => typeof id === 'number'))];

    const [categories, placeMedia, placeTags, users] = await this.prisma.$transaction([
      this.prisma.category.findMany({ where: { id: { in: categoryIds } } }),
      this.prisma.placeMedia.findMany({
        where: { ownerType: { in: ownerTypes }, ownerId: { in: placeIds } },
        orderBy: [{ isPrimary: 'desc' }, { sortOrder: 'asc' }, { id: 'asc' }]
      }),
      includeTags ? this.prisma.placeTag.findMany({ where: { placeId: { in: placeIds } } }) : this.prisma.placeTag.findMany({ where: { placeId: { in: [] } } }),
      userIds.length
        ? this.prisma.user.findMany({ where: { id: { in: userIds } }, select: { id: true, email: true, name: true, role: true } })
        : this.prisma.user.findMany({ where: { id: { in: [] } }, select: { id: true, email: true, name: true, role: true } })
    ]);

    const mediaFiles = placeMedia.length
      ? await this.prisma.mediaFile.findMany({ where: { id: { in: [...new Set(placeMedia.map((media) => media.mediaFileId))] } } })
      : [];
    const tags = placeTags.length ? await this.prisma.tag.findMany({ where: { id: { in: [...new Set(placeTags.map((tag) => tag.tagId))] } } }) : [];

    const categoriesById = new Map(categories.map((category) => [category.id, category]));
    const mediaFilesById = new Map(mediaFiles.map((file) => [file.id, file]));
    const tagsById = new Map(tags.map((tag) => [tag.id, tag]));
    const usersById = new Map(users.map((user) => [user.id, user]));
    const mediaByPlaceId = new Map<number, unknown[]>();
    const tagsByPlaceId = new Map<number, unknown[]>();

    for (const media of placeMedia) {
      const file = mediaFilesById.get(media.mediaFileId);
      if (!file) continue;

      const item = {
        id: media.id,
        mediaFileId: file.id,
        sortOrder: media.sortOrder,
        isPrimary: media.isPrimary,
        publicPath: file.publicPath,
        imageUrl: this.resolveImageUrl(file.publicPath),
        originalName: file.originalName,
        mimeType: file.mimeType,
        width: file.width,
        height: file.height
      };

      const current = mediaByPlaceId.get(media.ownerId) ?? [];
      current.push(item);
      mediaByPlaceId.set(media.ownerId, current);
    }

    for (const placeTag of placeTags) {
      const tag = tagsById.get(placeTag.tagId);
      if (!tag) continue;
      const current = tagsByPlaceId.get(placeTag.placeId) ?? [];
      current.push({ id: tag.id, name: tag.name, code: tag.code, groupName: tag.groupName });
      tagsByPlaceId.set(placeTag.placeId, current);
    }

    return places.map((place) => {
      const category = categoriesById.get(place.categoryId);
      const media = mediaByPlaceId.get(place.id) ?? [];

      return {
        ...place,
        category: category ? { id: category.id, name: category.name, code: category.code } : null,
        categoryName: category?.name ?? null,
        primaryImage: media[0] ?? null,
        media,
        tags: tagsByPlaceId.get(place.id) ?? [],
        createdBy: place.createdByUserId ? (usersById.get(place.createdByUserId) ?? null) : null,
        updatedBy: place.updatedByUserId ? (usersById.get(place.updatedByUserId) ?? null) : null
      };
    });
  }

  private resolveImageUrl(publicPath: string | null) {
    if (!publicPath) return null;
    if (publicPath.startsWith('http://') || publicPath.startsWith('https://') || publicPath.startsWith('/')) return publicPath;
    return `/${publicPath}`;
  }
}
