import * as React from "react";
import renderer from "react-test-renderer";
import SignInWithGoogle from "../SignInWithGoogle";

it(`renders correctly`, () => {
  const tree = renderer.create(<SignInWithGoogle />).toJSON();

  expect(tree).toMatchSnapshot();
});
