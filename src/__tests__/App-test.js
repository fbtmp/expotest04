import React from 'react';
import renderer from 'react-test-renderer';
import prettyFormat from 'pretty-format';

import App from '../App';

expect.addSnapshotSerializer({
  serialize(val, config, indentation, depth, refs, printer) {
    const serializer = prettyFormat.plugins.ReactElement;
    val.children.splice(0, 1);
    return serializer.serialize(val, config, indentation, depth, refs, printer);
  },
  test(val) {
    return (
      val &&
      val.type === 'Text' &&
      val.children?.length === 1 &&
      !val.children[0].trim().length
    );
  },
});

describe('<App />', () => {
  it('has 4 children', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree.children.length).toBe(4);
  });
  it('renders correctly', () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
