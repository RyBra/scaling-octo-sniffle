import { ConstructionSiteDto } from '@construction-journal/shared';
import { ConstructionSiteRecord } from '../domain/construction-site.repository';

export function toConstructionSiteDto(site: ConstructionSiteRecord): ConstructionSiteDto {
  return {
    id: site.id,
    name: site.name,
    address: site.address,
    createdAt: site.createdAt.toISOString(),
    updatedAt: site.updatedAt.toISOString(),
  };
}
