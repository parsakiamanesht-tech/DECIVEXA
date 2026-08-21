import { Module } from "@nestjs/common";
import { GetWorkspaceForOwnerUseCase } from "./workspace/get-workspace-for-owner.use-case";

@Module({
  providers: [GetWorkspaceForOwnerUseCase],
  exports: [GetWorkspaceForOwnerUseCase],
})
export class ApplicationModule {}
