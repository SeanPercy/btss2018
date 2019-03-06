/*
* less verbose declarations *
declare module "*.gif";
declare module "*.graphql";
declare module "*.jpeg";
declare module "*.jpg";
declare module "*.png";
declare module "*.svg";
*/

declare module "*.gif" {
    const fileName: string;
    export = fileName;
}
/*
declare module '*.graphql' {
    import {DocumentNode} from 'graphql';
    const value: DocumentNode;
    export default value;
}
*/
declare module "*.graphql" {
    const fileName: string;
    export = fileName;
}

declare module "*.jpeg" {
    const fileName: string;
    export = fileName;
}

declare module "*.jpg" {
    const fileName: string;
    export = fileName;
}

declare module "*.png" {
    const fileName: string;
    export = fileName;
}

declare module "*.svg" {
    const fileName: string;
    export = fileName;
}

