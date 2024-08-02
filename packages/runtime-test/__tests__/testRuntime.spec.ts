import {
  dumpOps,
  h,
  nextTick,
  nodeOps,
  NodeOpTypes,
  reactive,
  render,
  resetOps,
  TestElement,
  TestNodeTypes,
  TestText,
} from '../src'

describe('test renderer', () => {
  it('should work', () => {
    const root = nodeOps.createElement('div')
    render(
      h(
      'div',
      {
        id: 'test',
      },
      'hello',
    ), root)

    expect(root.children.length).toBe(1)

    const el = root.children[0] as TestElement
    expect(el.type).toBe(TestNodeTypes.ELEMENT)
    expect(el.props.id).toBe('test')
    expect(el.children.length).toBe(1)

    const text = el.children[0] as TestText
    expect(text.type).toBe(TestNodeTypes.TEXT)
    expect(text.text).toBe('hello')
  })
  it('should record ops', async () => {
    const state = reactive({
      id: 'test',
      text: 'hello',
    })

    const App = {
      render() {
        return h(
          'div',
          {
            id: state.id,
          },
          state.text,
        )
      },
      // ! 需要加 否则 走不到初始化Component.render方法
      setup() {
        return {
          msg: "tiny-vue",
        };
      },
    }
    const root = nodeOps.createElement('div')

    resetOps()
    render(h(App), root)
    const ops = dumpOps()

    expect(ops.length).toBe(4)

    expect(ops[0]).toEqual({
      type: NodeOpTypes.CREATE,
      nodeType: TestNodeTypes.ELEMENT,
      tag: 'div',
      targetNode: root.children[0],
    })

    expect(ops[1]).toEqual({
      type: NodeOpTypes.SET_ELEMENT_TEXT,
      text: 'hello',
      targetNode: root.children[0],
    })

    expect(ops[2]).toEqual({
      type: NodeOpTypes.PATCH,
      targetNode: root.children[0],
      propKey: 'id',
      propPrevValue: null,
      propNextValue: 'test',
    })

    expect(ops[3]).toEqual({
      type: NodeOpTypes.INSERT,
      targetNode: root.children[0],
      parentNode: root,
      refNode: null,
    })

    // test update ops
    state.id = 'foo'
    state.text = 'bar'
    await nextTick()

    const updateOps = dumpOps()
    expect(updateOps.length).toBe(2)

    expect(updateOps[0]).toEqual({
      type: NodeOpTypes.SET_ELEMENT_TEXT,
      targetNode: root.children[0],
      text: 'bar',
    })

    expect(updateOps[1]).toEqual({
      type: NodeOpTypes.PATCH,
      targetNode: root.children[0],
      propKey: 'id',
      propPrevValue: 'test',
      propNextValue: 'foo',
    })
  })
})
