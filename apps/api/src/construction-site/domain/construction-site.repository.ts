export interface ConstructionSiteRecord {
  id: string;
  name: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConstructionSiteData {
  name: string;
  address?: string;
}

export interface UpdateConstructionSiteData {
  name?: string;
  address?: string | null;
}

export const CONSTRUCTION_SITE_REPOSITORY = Symbol('CONSTRUCTION_SITE_REPOSITORY');

export interface IConstructionSiteRepository {
  findAll(): Promise<ConstructionSiteRecord[]>;
  findById(id: string): Promise<ConstructionSiteRecord | null>;
  create(data: CreateConstructionSiteData): Promise<ConstructionSiteRecord>;
  update(id: string, data: UpdateConstructionSiteData): Promise<ConstructionSiteRecord>;
  delete(id: string): Promise<void>;
}
