# Rustの構造体メンバは、メモリ上で順番に並ぶとは限らない

- Rustコンパイラは、構造体のメンバをメモリ効率が良いように自動で並び替える
- 例:
  ```rust
  use std::mem;

  struct S {
      a: u8,
      b: u64,
      c: u8,
  }

  fn main() {
      let offset_a = mem::offset_of!(S, a);
      let offset_b = mem::offset_of!(S, b);
      let offset_c = mem::offset_of!(S, c);

      println!("offset_of(S, a)!: {}", offset_a);
      println!("offset_of(S, b)!: {}", offset_b);
      println!("offset_of(S, c)!: {}", offset_c);
  }
  ```

  ```
  offset_of(S, a)!: 8
  offset_of(S, b)!: 0
  offset_of(S, c)!: 9
  ```
- もしこのような並び替えが好ましくない場合、構造体に`#[repr(C)]`を付与することで並び替えを防げる:
  ```rust
  #[repr(C)]
  struct S {
      a: u8,
      b: u64,
      c: u8,
  }
  ```
  ```
  offset_of(S, a)!: 0
  offset_of(S, b)!: 8
  offset_of(S, c)!: 16
  ```