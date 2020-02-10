import React from 'react';
import ReactDOM from 'react-dom';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Sortly, { ContextProvider, useDrag, useDrop } from 'react-sortly';
import MultipleTree from './MultipleTree'

const ItemRenderer = (props) => {
  const { data: { name, depth } } = props;
  const [, drag] = useDrag();
  const [, drop] = useDrop();

  return (
    <div ref={drop}>
      <div ref={drag} style={{ marginLeft: depth * 20 }}>{name}</div>
    </div>
  );
};


const CATEGORIES = [
  {
    id: 1,
    name: "Semster 1",
    items: [
      {id:1,categoryId: 1, name: "Miss Dangelo Bailey", depth: 0},
      {id:2,categoryId: 1, name: "Miss Dangelo Bailey", depth: 0}    
    ]
  },
  {
    id: 2,
    name: "Semster 2",
    items: [
      {id:1,categoryId: 1, name: "Miss Dangelo Bailey", depth: 0},
      {id:2,categoryId: 1, name: "Miss Dangelo Bailey", depth: 0}    
    ]
  },
  {
    id: 3,
    name: "Semster 3",
    items: [
      {id:1,categoryId: 1, name: "Miss Dangelo Bailey", depth: 0},
      {id:2,categoryId: 1, name: "Miss Dangelo Bailey", depth: 0}    
    ]
  }
]
console.log('CATEGORIES',CATEGORIES)
const MySortableTree = () => {
  const [items, setItems] = React.useState([
    { id: 1, name: 'Priscilla Cormier', depth: 0 },
    { id: 2, name: 'Miss Erich Bartoletti', depth: 0 },
    { id: 3, name: 'Alison Friesen', depth: 1 },
    { id: 4, name: 'Bernita Mayert', depth: 2 },
    { id: 5, name: 'Garfield Berge', depth: 0 },
  ]);
  const handleChange = (newItems) => {
    setItems(newItems);
  };
  
  return (
    <Sortly items={items} onChange={handleChange}>
      {(props) => <ItemRenderer {...props} />}
    </Sortly>
  );
};

const App = () => (
 <DndProvider backend={HTML5Backend}>
   <ContextProvider>
     <MultipleTree />
   </ContextProvider>
 </DndProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
