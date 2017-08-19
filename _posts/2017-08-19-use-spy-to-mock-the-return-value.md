---
layout: post
title: Use Spy to Mock the Return Value
categories: til
tags: [til-jasmine, jasmine, javascript]
---

## Simple mocking/stubbing

Example of how to mock the return value of a class method using Jasmine's Spy object.

Class file:
```
class SimpleClass {
  constructor() {}

  getAuthHeaders() {
    return this.realGetAuthHeaders();
  }

  realGetAuthHeaders() {
    return 'real';
  }
}
module.exports = SimpleClass;
```

Test file:
```
const SimpleClass = require('SimpleClass');

describe('SimpleClass', () => {
  it('should mock internal call to realGetAuthHeaders', () => {
    const simpleClass = new SimpleClass();
    spyOn(simpleClass, 'realGetAuthHeaders').and.returnValue('notReal');
    expect(simpleClass.getAuthHeaders()).toEqual('notReal');
  });
});
```
