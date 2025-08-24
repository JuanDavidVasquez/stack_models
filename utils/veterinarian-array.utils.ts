
export class VeterinarianArrayUtils {
  
  /**
   * Agrega elemento a array si no existe
   */
  static addToArray<T>(array: T[] | undefined, item: T): T[] {
    if (!array) array = [];
    
    if (!array.includes(item)) {
      array.push(item);
    }
    
    return array;
  }

  /**
   * Remueve elemento de array
   */
  static removeFromArray<T>(array: T[] | undefined, item: T): T[] | undefined {
    if (!array) return undefined;
    
    const filtered = array.filter(el => el !== item);
    return filtered.length > 0 ? filtered : undefined;
  }

  /**
   * Verifica si array contiene elemento (búsqueda parcial para strings)
   */
  static arrayContains(array: string[] | undefined, searchTerm: string): boolean {
    if (!array) return false;
    
    return array.some(item => 
      item.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  /**
   * Busca elementos que coincidan con términos
   */
  static findMatching(array: string[] | undefined, searchTerms: string[]): string[] {
    if (!array) return [];
    
    return array.filter(item =>
      searchTerms.some(term =>
        item.toLowerCase().includes(term.toLowerCase())
      )
    );
  }

  /**
   * Compara dos arrays y retorna diferencias
   */
  static compareArrays<T>(array1: T[] = [], array2: T[] = []): {
    unique1: T[];
    unique2: T[];
    shared: T[];
  } {
    return {
      unique1: array1.filter(item => !array2.includes(item)),
      unique2: array2.filter(item => !array1.includes(item)),
      shared: array1.filter(item => array2.includes(item))
    };
  }
}