import { RequestContext } from '../context/request-context';
import { Result } from '../shared/result/result';

export interface ApplicationUseCase<Input, Output> {
  execute(input: Input, context: RequestContext): Promise<Result<Output>>;
}
