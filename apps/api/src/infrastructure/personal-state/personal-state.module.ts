import { Module } from "@nestjs/common";
import { PERSONAL_STATE_REPOSITORY } from "../../core/personal-state/personal-state.repository.token";
import { DatabaseService } from "../../persistence/database.service";
import { DrizzlePersonalStateRepository } from "../persistence/personal-state.repository";
import { PersonalStateUseCase } from "../../application/personal-state/personal-state.use-case";
import { PersonalStateController } from "./personal-state.controller";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [PersonalStateController],
  providers: [
    DatabaseService,
    PersonalStateUseCase,
    {
      provide: PERSONAL_STATE_REPOSITORY,
      useFactory: (database: DatabaseService) => new DrizzlePersonalStateRepository(database.client),
      inject: [DatabaseService],
    },
  ],
})
export class PersonalStateModule {}
