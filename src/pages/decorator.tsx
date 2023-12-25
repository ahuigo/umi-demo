function checkPassword(limit: number) {
  return function (target: Object, propertyKey: string) {
    let value: string;
    const getter = function () {
      alert(2)
      return value;
    };
    const setter = function (newVal: string) {
      // not work
      alert(3)
      console.log("setter", newVal);
      if (newVal.length < limit) {
        Object.defineProperty(target, 'errors', {
          value: `Your password should be bigger than ${limit}`
        });
      } else {
        value = newVal;
      }
    };
    Object.defineProperty(target, propertyKey, {
      get: getter,
      set: setter
    });
  };
}

class User {
  username: string;
  @checkPassword(8)
  password: string;
  errors: any;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}


function getUser() {
  const danyUser = new User("Alex", "1234");
  danyUser.password = "4567";
  console.log(danyUser);
  console.log(danyUser.password);
  console.log(danyUser.errors);
  return danyUser;
}

const currentUser = getUser();

export default function Demo() {
  return (
    <div>
      <div>currentUser:{JSON.stringify(currentUser)} </div>
      <div>errors:{JSON.stringify(currentUser.errors)} </div>
    </div>
  );
}
