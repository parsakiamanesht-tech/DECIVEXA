import { Module } from "@nestjs/common";
import { ApplicationModule } from "../../application/application.module";
import { USER_CREDENTIALS_REPOSITORY } from "../../application/auth/user-credentials.repository";
import { PersistenceModule } from "../persistence/persistence.module";
import { DatabaseService } from "../../persistence/database.service";
import { AccessTokenService } from "./access-token.service";
import { AuthenticationGuard } from "./authentication.guard";
import { AuthController } from "./auth.controller";
import { DrizzleUserCredentialsRepository } from "./drizzle-user-credentials.repository";
import { PasswordService } from "./password.service";
import { AuthenticateUserUseCase } from "../../application/auth/authenticate-user.use-case";
import { RegisterUserUseCase } from "../../application/auth/register-user.use-case";

@Module({
  imports: [PersistenceModule, ApplicationModule],
  controllers: [AuthController],
  providers: [
    DatabaseService,
    PasswordService,
    AccessTokenService,
    AuthenticationGuard,
    AuthenticateUserUseCase,
    RegisterUserUseCase,
    {
      provide: USER_CREDENTIALS_REPOSITORY,
      useFactory: (database: DatabaseService) => new DrizzleUserCredentialsRepository(database.client),
      inject: [DatabaseService],
    },
  ],
  exports: [AuthenticationGuard, AccessTokenService],
})
export class AuthModule {}
