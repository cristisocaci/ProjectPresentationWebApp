import {Info} from "./info";

export class Project {
    projectId: number;
    title: string;
    photo: string;
    description: string;
    position: number;
    startDate: Date;
    endDate: Date;

    userId: string;
    infos: Array<Info> = new Array<Info>();
}
