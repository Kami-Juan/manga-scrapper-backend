import { MakeMigrationUseCase } from './MakeMigrationUseCase';
import { MakeMigrationController } from './MakeMigrationController';
import { migrationRepository } from '../../repository';
import { listMangaRepository } from '../../../list_manga/repository';

const makeMigrationUseCase = new MakeMigrationUseCase(
  migrationRepository,
  listMangaRepository,
);

const makeMigrationController = new MakeMigrationController(
  makeMigrationUseCase,
);

export { makeMigrationUseCase, makeMigrationController };
