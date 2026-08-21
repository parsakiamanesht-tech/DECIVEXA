import { Module } from "@nestjs/common";
import { USER_CREDENTIALS_REPOSITORY } from "../../application/auth/user-credentials.repository";
import { ACCESS_TOKEN_SERVICE } from "../../application/auth/access-token.service.port";
import { PASSWORD_SERVICE } from "../../application/auth/password.service.port";
import { AuthenticateUserUseCase } from "../../application/auth/authenticate-user.use-case";
import { RegisterUserUseCase } from "../../application/auth/register-user.use-case";
import { PersistenceModule } from "../persistence/persistence.module";
import { DatabaseService } from "../../persistence/database.service";
import { AccessTokenService } from "./access-token.service";
import { AuthenticationGuard } from "./authentication.guard";
import { AuthController } from "./auth.controller";
import { DrizzleUserCredentialsRepository } from "./drizzle-user-credentials.repository";
import { PasswordService } from "./password.service";

@Module({
  imports: [PersistenceModule],
  controllers: [AuthController],
  providers: [
    DatabaseService,
    PasswordService,
    AccessTokenService,
    AuthenticationGuard,
    {
      provide: PASSWORD_SERVICE,
      useExisting: PasswordService,
    },
    {
      provide: ACCESS_TOKEN_SERVICE,
      useExisting: AccessTokenService,
    },
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
