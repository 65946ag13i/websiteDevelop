type DeepClone<T> = T extends File
  ? T // 如果是 File，直接返回自身
  : T extends (infer U)[]
    ? DeepClone<U>[] // 如果是陣列，遞歸處理元素
    : T extends object
      ? { [K in keyof T]: DeepClone<T[K]> } // 如果是物件，遞歸處理屬性
      : T; // 其他類型直接返回自身

function deepClone<T>(item: T): DeepClone<T> {
  if (item instanceof File) {
    return item as DeepClone<T>; // 如果是 File，直接返回
  }
  if (Array.isArray(item)) {
    // 递归克隆数组中的每个元素
    return item.map(deepClone) as DeepClone<T>; // 使用类型断言确保类型匹配
  } else if (item && typeof item === "object") {
    // 递归克隆对象的每个属性
    const clonedObj: { [key: string]: unknown } = {};
    for (const key in item) {
      if (item.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(item[key]); // 递归克隆每个属性
      }
    }
    return clonedObj as DeepClone<T>; // 使用类型断言确保类型匹配
  }
  // 基本类型直接返回
  return item as DeepClone<T>;
}

export function deepCloneArray<T>(arr: T[]): DeepClone<T>[] {
  return arr.map(deepClone); // 对数组中的每个元素进行深度克隆
}

// // 基本類型直接返回
// type Test1 = DeepClone<number>;         // number
// type Test2 = DeepClone<string>;        // string
// type Test3 = DeepClone<null>;          // null
// type Test4 = DeepClone<undefined>;     // undefined

// // 陣列會遞歸處理
// type Test5 = DeepClone<number[]>;      // number[]
// type Test6 = DeepClone<string[][]>;    // string[][]

// // 對象會遞歸處理
// type Test7 = DeepClone<{ a: number, b: string }>; // { a: number, b: string }
// type Test8 = DeepClone<{ a: { b: number[] } }>;  // { a: { b: number[] } }

// // 函數類型或其他非陣列、非對象類型直接返回
// type Test9 = DeepClone<() => void>;    // () => void  函數只是引用  並非複製
// type Test10 = DeepClone<symbol>;       // symbol  這裡也是引用，意味著指向原本的symbol
