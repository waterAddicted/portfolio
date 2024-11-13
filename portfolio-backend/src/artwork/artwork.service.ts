import { Injectable } from '@nestjs/common';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Artwork, Status } from './entities/artwork.entity';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm';

@Injectable()
export class ArtworkService {
  constructor(
    @InjectRepository(Artwork) private artworkRepository: Repository<Artwork>,
  ) {}

  async create(createArtworkDto: CreateArtworkDto) {
    const artwork: DeepPartial<Artwork> = {
      ...createArtworkDto,
      status: Status.VISIBLE // Default value for new artwork (as numeric enum value)
    };
    const newArtwork = this.artworkRepository.create(artwork);
    return this.artworkRepository.save(newArtwork);
  }

  async findAll() {
    try {
      console.log('Fetching all artworks with status VISIBLE...');
      const artworks = await this.artworkRepository.find({
        where: { status: Status.VISIBLE },
      });
      console.log('Artworks found:', artworks);
      return artworks;
    } catch (error) {
      console.error('Error fetching artworks:', error);
      throw new Error('Failed to fetch artworks');
    }
  }
  

  async findOne(id: number) {
    const artwork = await this.artworkRepository.findOneBy({ id });
    if (!artwork) {
      throw new Error('Artwork not found');
    }
    return artwork;
  }

  async update(id: number, updateArtworkDto: UpdateArtworkDto) {
    const artwork = await this.findOne(id);
    if (!artwork) {
      throw new Error('Artwork not found');
    }
    const updateData: DeepPartial<Artwork> = {
      ...updateArtworkDto,
      status: Number(updateArtworkDto.status) as Status, // Convert status to Status enum
    };
    await this.artworkRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number) {
    const artwork = await this.findOne(id);
    if (!artwork) {
      throw new Error('Artwork not found');
    }
    await this.artworkRepository.delete(id);
    return artwork;
  }
}