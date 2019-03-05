import { IResponse } from './iresponse';

export class Runner implements IResponse {
    id: number;
    name: string;
    dateOfBirth: Date;
    sex: string;
    sexId: number;
    success: boolean;
    errorMessage: string;
}
