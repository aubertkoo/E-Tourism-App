// OOPExample.js

// 封装（Encapsulation）：把属性和方法封装在一个类里面
class Attraction {
  constructor(name, location) {
    this.name = name;
    this.location = location;
  }

  getDetails() {
    return `${this.name} is located at ${this.location}.`;
  }
}

// 继承（Inheritance）：NationalPark 继承 Attraction
class NationalPark extends Attraction {
  constructor(name, location, parkSize) {
    super(name, location); // 调用父类的构造函数
    this.parkSize = parkSize;
  }

  // 多态（Polymorphism）：重写 getDetails 方法
  getDetails() {
    return `${this.name} is a national park located at ${this.location}. Size: ${this.parkSize}.`;
  }
}

// 抽象（Abstraction）：模仿一个“抽象类”的行为（JS 没有真正的 abstract）
class AbstractAttraction {
  constructor(name) {
    if (this.constructor === AbstractAttraction) {
      throw new Error("Cannot instantiate abstract class!");
    }
    this.name = name;
  }

  show() {
    throw new Error("Abstract method must be implemented.");
  }
}

class Museum extends AbstractAttraction {
  constructor(name, exhibits) {
    super(name);
    this.exhibits = exhibits;
  }

  show() {
    return `${this.name} museum has exhibits: ${this.exhibits.join(", ")}`;
  }
}

if (__DEV__) {
  const bako = new NationalPark("Bako National Park", "Kuching", "27 km²");
  const catMuseum = new Museum("Cat Museum", ["Cat Statues", "Photos", "History"]);
  console.log("OOP Test:", bako.getDetails());
  console.log("OOP Test:", catMuseum.show());
}
