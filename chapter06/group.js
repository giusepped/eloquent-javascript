class Group {
    // Your code here.
    constructor(arr) {
        this.content = arr;
        this.index = 0;
    }

    has(element) {
        for(let e of this.content) {
            if(e === element) { return true };
        }
        return false;
    }

    add(element) {
        if(!this.has(element)) {
            this.content.push(element);
        }
    }

    delete(element) {
        this.content = this.content.filter(e => e !== element);
    }

    static from(arr) {
        return new Group(arr);
    }

    next() {
        if(index === this.content.length - 1) { return {done: true}; }
        value = this.content[index];
        this.index++;
        return {value: value, done: false};
    }
  }
  
  let group = Group.from([10, 20]);
  console.log(group.has(10));
  // → true
  console.log(group.has(30));
  // → false
  group.add(10);
  group.delete(10);
  console.log(group.has(10));
  // → false