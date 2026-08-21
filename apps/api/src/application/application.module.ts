import { DynamicModule, Module, type ModuleMetadata } from "@nestjs/common";
import { GetWorkspaceForOwnerUseCase } from "./workspace/get-workspace-for-owner.use-case";

@Module({})
export class ApplicationModule {
  static register(imports: ModuleMetadata["imports"] = []): DynamicModule {
    return {
      module: ApplicationModule,
      imports,
      providers: [GetWorkspaceForOwnerUseCase],
      exports: [GetWorkspaceForOwnerUseCase],
    };
  }
}
