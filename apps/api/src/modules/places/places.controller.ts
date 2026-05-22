import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import type { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PlacesService } from './places.service';
import type { AuthUser } from '../auth/auth.types';
import type { AttachPlaceMediaInput, BulkDeletePlaceMediaInput, CreatePlaceInput, ListPlacesQuery, UpdatePartnerInput, UpdatePlaceInput } from './places.types';

type AuthenticatedRequest = Request & { user: AuthUser };

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('places')
export class PlacesController {
  constructor(private readonly places: PlacesService) {}

  @Get()
  list(@Query() query: ListPlacesQuery) {
    return this.places.list(query);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.places.get(Number(id));
  }

  @Post()
  @Roles('admin', 'staff')
  create(@Body() body: CreatePlaceInput, @Req() request: AuthenticatedRequest) {
    return this.places.create(body, request.user);
  }

  @Patch(':id')
  @Roles('admin', 'staff')
  update(@Param('id') id: string, @Body() body: UpdatePlaceInput, @Req() request: AuthenticatedRequest) {
    return this.places.update(Number(id), body, request.user);
  }

  @Patch(':id/partner')
  @Roles('admin')
  updatePartner(@Param('id') id: string, @Body() body: UpdatePartnerInput, @Req() request: AuthenticatedRequest) {
    return this.places.updatePartner(Number(id), body, request.user);
  }

  @Get(':id/media/available')
  @Roles('admin', 'staff')
  listAvailableMedia(@Query('q') q?: string) {
    return this.places.listAvailableMedia(q);
  }

  @Post(':id/media')
  @Roles('admin', 'staff')
  attachMedia(@Param('id') id: string, @Body() body: AttachPlaceMediaInput, @Req() request: AuthenticatedRequest) {
    return this.places.attachMedia(Number(id), body, request.user);
  }

  @Post(':id/media/upload')
  @Roles('admin', 'staff')
  @UseInterceptors(FileInterceptor('file'))
  uploadMedia(@Param('id') id: string, @UploadedFile() file: Express.Multer.File, @Req() request: AuthenticatedRequest) {
    return this.places.uploadMedia(Number(id), file, request.user);
  }

  @Delete(':id/media/:mediaId')
  @Roles('admin', 'staff')
  deleteMedia(@Param('id') id: string, @Param('mediaId') mediaId: string, @Req() request: AuthenticatedRequest) {
    return this.places.deleteMedia(Number(id), Number(mediaId), request.user);
  }

  @Post(':id/media/bulk-delete')
  @Roles('admin', 'staff')
  bulkDeleteMedia(@Param('id') id: string, @Body() body: BulkDeletePlaceMediaInput, @Req() request: AuthenticatedRequest) {
    return this.places.bulkDeleteMedia(Number(id), body, request.user);
  }
}
