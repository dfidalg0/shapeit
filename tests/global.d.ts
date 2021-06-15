declare const faker: typeof import('faker');
declare function genData(): {
    [P in import('@/types/utils').Primitive]: import('@/types/utils').FromPrimitive<P>
}
