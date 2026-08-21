import { Result } from '../shared/result/result';

export interface ApplicationUseCase<Input, Output> {
  execute(input: Input): Promise<Result<Output>>;
}
