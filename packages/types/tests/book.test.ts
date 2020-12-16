import { bookToString } from "@mr/types";

describe("bookToString() tests", function () {
  test("should return title of book", () => {
    expect(
      bookToString({
        id: "id",
        title: "Clean Code",
        author: "Uncle Bob",
      })
    ).toBe("Clean Code");
  });
});
