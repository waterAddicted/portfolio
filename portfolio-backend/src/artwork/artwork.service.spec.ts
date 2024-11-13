import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtworkService } from './artwork.service';
import { Artwork, Status } from './entities/artwork.entity';
import { CreateArtworkDto } from './dto/create-artwork.dto';

const mockArtworkRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ArtworkService', () => {
  let service: ArtworkService;
  let repository: MockRepository<Artwork>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArtworkService,
        {
          provide: getRepositoryToken(Artwork),
          useFactory: mockArtworkRepository,
        },
      ],
    }).compile();

    service = module.get<ArtworkService>(ArtworkService);
    repository = module.get<MockRepository<Artwork>>(getRepositoryToken(Artwork));
  });

  it('should create an artwork', async () => {
    const createArtworkDto: CreateArtworkDto = { title: 'Test Artwork', clientUrl: 'http://example.com' };
    const artwork = { id: 1, ...createArtworkDto, status: Status.VISIBLE };

    repository.create.mockReturnValue(artwork);
    repository.save.mockResolvedValue(artwork);

    expect(await service.create(createArtworkDto)).toEqual(artwork);
  });

  it('should return all visible artworks', async () => {
    const artworks = [{ id: 1, title: 'Visible Artwork', status: Status.VISIBLE }];
    repository.find.mockResolvedValue(artworks);

    expect(await service.findAll()).toEqual(artworks);
  });

  it('should return an artwork by ID', async () => {
    const artwork = { id: 1, title: 'Artwork', status: Status.VISIBLE };
    repository.findOneBy.mockResolvedValue(artwork);

    expect(await service.findOne(1)).toEqual(artwork);
  });

  it('should throw an error if artwork not found', async () => {
    repository.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow('Artwork not found');
  });

  it('should update an artwork', async () => {
    const artwork = { id: 1, title: 'Updated Artwork', status: Status.HIDDEN };
    repository.findOneBy.mockResolvedValue(artwork);
    repository.update.mockResolvedValue(artwork);

    expect(await service.update(1, { title: 'Updated Artwork' })).toEqual(artwork);
  });

  it('should delete an artwork', async () => {
    const artwork = { id: 1, title: 'Artwork', status: Status.VISIBLE };
    repository.findOneBy.mockResolvedValue(artwork);
    repository.delete.mockResolvedValue({});

    expect(await service.remove(1)).toEqual(artwork);
  });
});
