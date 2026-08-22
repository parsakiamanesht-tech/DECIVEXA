import { Module } from "@nestjs/common";
import { WORKSPACE_REPOSITORY } from "../../core/resource/workspace.repository.token";
import { DatabaseService } from "../../persistence/database.service";
import { DrizzleWorkspaceRepository } from "./workspace.repository";

@Module({
  providers: [
    DatabaseService,
    {
      provide: WORKSPACE_REPOSITORY,
      useFactory: (database: DatabaseService) =>
        new DrizzleWorkspaceRepository(database.client),
      inject: [DatabaseService],
    },
  ],
  exports: [WORKSPACE_REPOSITORY],
})
export class PersistenceModule {}
