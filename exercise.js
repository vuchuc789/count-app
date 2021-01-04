function* gen() {
  yield "a";
  yield "b";
  return "c";
}

const a = gen();
console.log(a.next().value);
console.log(a.next().value);
console.log(a.next().value);
console.log(a.next().value);
