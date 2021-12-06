import { MeNum, SomeNamespace } from "./foo";

enum Boo {
  Foo,
}

console.log(MeNum);

console.log(Boo);

console.log(SomeNamespace.SomeEnum);

const x = MeNum;
const y = Boo;
const z = SomeNamespace.SomeEnum;

for (const i in MeNum) {
  void i;
}

for (const i in Boo) {
  void i;
}

for (const i in SomeNamespace.SomeEnum) {
  void i;
}
