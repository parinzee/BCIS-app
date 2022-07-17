import * as React from "react";
import renderer from "react-test-renderer";
import NewsItem from "../NewsItem";

it(`renders correctly`, () => {
  const tree = renderer
    .create(
      <NewsItem
        title="Amazing Title"
        emoji="😁"
        description="Test some **bold**, *italic*, and **both** and [links](https://github.com/parinzee)!"
        dateUpdated={new Date()}
        width={400}
      />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
