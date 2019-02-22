import { Gender } from '../models/gender';

export interface  Runner {
    id: number;
    name: string;
    dateOfBirth: string;
    gender: Gender;
}
