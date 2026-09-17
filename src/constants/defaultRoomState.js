export function getDefaultRoomState() {
  return {
    language: "javascript",
    code: `function welcome(name) {
  console.log("Hello, " + name);
}

welcome("Rahul");`,
    codeEnabled: true,
    codeShared: false,
  };
}
