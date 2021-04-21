export interface BaseMapper<T> {
  toDomain(raw?: any): T;
  toDTO(domain?: any): any;
}
