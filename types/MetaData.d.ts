export interface MetaDataAttribute {
  trait_type: string;
  value: string;
}

export type MetaData = {
  name?: string;
  description?: string;
  image?: string;
  animation_url?: string;
  attributes?: MetaDataAttribute[];
};
