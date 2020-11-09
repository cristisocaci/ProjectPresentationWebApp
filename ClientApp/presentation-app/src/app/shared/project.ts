import {Info} from "./info";

export class Project {
    projectId: number;
    title: string;
    photo: string;
    description: string;
    position: number;
    userId: string;
    infos: Array<Info> = new Array<Info>();
}
