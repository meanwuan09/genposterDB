import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesRepository } from './places.repository';
import { PlacesService } from './places.service';

@Module({
  controllers: [PlacesController],
  providers: [PlacesService, PlacesRepository]
})
export class PlacesModule {}
