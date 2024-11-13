import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ArtworkService } from './artwork.service';
import { CreateArtworkDto } from './dto/create-artwork.dto';
import { UpdateArtworkDto } from './dto/update-artwork.dto';
import { Express } from 'express';

@Controller('artwork')
export class ArtworkController {
  constructor(private readonly artworkService: ArtworkService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/artworks',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtName = extname(file.originalname);
        const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtName}`;
        callback(null, fileName);
      },
    }),
  }))
  async create(@Body() createArtworkDto: CreateArtworkDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }

    createArtworkDto.artworkImageUrl = `/uploads/artworks/${file.filename}`;
    return this.artworkService.create(createArtworkDto);
  }

  @Get()
  async findAll() {
    try {
      return await this.artworkService.findAll();
    } catch (error) {
      throw new HttpException('Failed to fetch artworks', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.artworkService.findOne(+id);
    } catch (error) {
      throw new HttpException('Artwork not found', HttpStatus.NOT_FOUND);
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/artworks',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const fileExtName = extname(file.originalname);
        const fileName = `${file.fieldname}-${uniqueSuffix}${fileExtName}`;
        callback(null, fileName);
      },
    }),
  }))
  async update(@Param('id') id: string, @Body() updateArtworkDto: UpdateArtworkDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      updateArtworkDto.artworkImageUrl = `/uploads/artworks/${file.filename}`;
    }
    try {
      return await this.artworkService.update(+id, updateArtworkDto);
    } catch (error) {
      throw new HttpException('Failed to update artwork', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.artworkService.remove(+id);
    } catch (error) {
      throw new HttpException('Artwork not found', HttpStatus.NOT_FOUND);
    }
  }
}
