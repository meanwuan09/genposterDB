import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PlacesRepository } from './places.repository';
import type { AuthUser } from '../auth/auth.types';
import type { AttachPlaceMediaInput, BulkDeletePlaceMediaInput, CreatePlaceInput, ListPlacesQuery, UpdatePartnerInput, UpdatePlaceInput } from './places.types';

const partnerFields = ['partnerRelation', 'partnerPriority'];

@Injectable()
export class PlacesService {
  constructor(private readonly places: PlacesRepository) {}

  list(query: ListPlacesQuery) {
    return this.places.list(query);
  }

  async get(id: number) {
    const place = await this.places.findById(id);
    if (!place) throw new NotFoundException('Place not found');
    return place;
  }

  create(input: CreatePlaceInput, actor: AuthUser) {
    this.assertNoPartnerFields(input);
    return this.places.create(input, actor.id);
  }

  async update(id: number, input: UpdatePlaceInput & Record<string, unknown>, actor: AuthUser) {
    this.assertNoPartnerFields(input);
    await this.get(id);
    return this.places.update(id, input, actor.id);
  }

  async updatePartner(id: number, input: UpdatePartnerInput, actor: AuthUser) {
    await this.get(id);
    return this.places.updatePartner(id, input, actor.id);
  }

  listAvailableMedia(q?: string) {
    return this.places.listAvailableMedia(q);
  }

  async attachMedia(id: number, input: AttachPlaceMediaInput, actor: AuthUser) {
    await this.get(id);
    return this.places.attachMedia(id, input, actor.id);
  }

  async uploadMedia(id: number, file: Express.Multer.File, actor: AuthUser) {
    await this.get(id);
    if (!file.mimetype.startsWith('image/')) throw new BadRequestException('Only image uploads are supported');
    return this.places.uploadMedia(id, file, actor.id);
  }

  async deleteMedia(id: number, mediaId: number, _actor: AuthUser) {
    await this.get(id);
    return this.places.deleteMedia(id, [mediaId]);
  }

  async bulkDeleteMedia(id: number, input: BulkDeletePlaceMediaInput, _actor: AuthUser) {
    await this.get(id);
    if (!Array.isArray(input.ids) || input.ids.length === 0) throw new BadRequestException('ids is required');
    return this.places.deleteMedia(id, input.ids.map(Number));
  }

  private assertNoPartnerFields(input: Record<string, unknown>) {
    const submittedPartnerField = partnerFields.find((field) => Object.prototype.hasOwnProperty.call(input, field));
    if (submittedPartnerField) throw new BadRequestException('Use /places/:id/partner to update partner fields');
  }
}
