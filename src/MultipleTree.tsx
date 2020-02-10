import React from 'react';
import { Flipper } from 'react-flip-toolkit';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import faker from 'faker/locale/en';
import update from 'immutability-helper';
import { useDrop } from 'react-dnd';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import Sortly, { ItemData, DragObject, add, remove, findDescendants } from 'react-sortly';
import DefaultItemRenderer from './DefaultItemRenderer';
import useScreenSize from './useScreenSize';

// const useStyles = makeStyles(theme => ({
//   root: {
//     flexGrow: 1,
//   },
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: 'center',
//     color: theme.palette.text.secondary,
//   },
// }));

let idSeq = 0;
// const generate = (numItems, categoryId) => (
//   Array
//     .from(Array(numItems).keys())
//     .map(() => {
//       idSeq += 1;
//       return {
//         id: idSeq,
//         categoryId,
//         name: faker.name.findName(),
//         depth: 0,
//       };
//     })
// );

// const CATEGORIES = Array.from(Array(3).keys()).map((data, index) => 
// ({
//   id: index + 1,
//   name: faker.address.country(),
//   items: generate(5, index + 1),
// }));


const CATEGORIES2 = [
  {
    id: 1,
    name: "Semster 1",
    items: [
      {id:1,categoryId: 1, name: "Basic Circuit Theory Network analysis", depth: 0},
      {id:2,categoryId: 1, name: "Basic Circuit Theory Network analysis", depth: 0},
      {id:3,categoryId: 1, name: "Basic Circuit Theory Network analysis", depth: 0},
      {id:4,categoryId: 1, name: "Basic Circuit Theory Network analysis", depth: 0}  
    ]
  },
  {
    id: 2,
    name: "Semster 2",
    items: [
      // {id:3,categoryId: 2, name: "Miss Dangelo Bailey", depth: 0},
      // {id:4,categoryId: 2, name: "Miss Dangelo Bailey", depth: 0}    
    ]
  },
  {
    id: 3,
    name: "Semster 3",
    items: [
      // {id:4,categoryId: 3, name: "Miss Dangelo Bailey", depth: 0},
      // {id:5,categoryId: 3, name: "Miss Dangelo Bailey", depth: 0}    
    ]
  },
  {
    id: 4,
    name: "Course",
    items: [
            
    ]
  }
]


const Tree = ({id, items, onChange, onEnter }) => {
  const [{ hovered, dragItem }, drop] = useDrop({
    accept: 'TREE',
    collect: (monitor) => ({
      hovered: monitor.isOver(),
      dragItem: monitor.getItem(),
    }),
  });

  const handleMove = React.useCallback(() => {
    if (!dragItem) {
      return;
    }

    if (hovered) {
      onEnter(dragItem);
    }
  }, [dragItem, hovered, onEnter]);

  React.useEffect(() => {
    if (dragItem) {
      handleMove();
    }
  }, [dragItem, hovered, handleMove]);

  return (
    <div ref={drop} style={{ paddingBottom: 50 }}>
      <Sortly
        type="TREE"
        items={items}
        onChange={onChange}
      >
        {DefaultItemRenderer}
      </Sortly>
    </div>
  );
};
 

const MultipleTree = () => {
  const onsubmit = () => {
    console.log('clicked',categories);
  }
  const { isLargeScreen } = useScreenSize();
  const [categories, setCategories] = React.useState(CATEGORIES2);
  const handleChange = (index) => (newItems) => 
  {
    setCategories(update(categories, {
      [index]: { items: { $set: newItems } },
    }));
  };
  const handleEnter = (targetCategoryIndex) => (dragItem) => {
    const sourceCategoryIndex = categories.findIndex((category) => (
      category.items.some((item) => item.id === dragItem.id)
    ));
    const sourceCategory = categories[sourceCategoryIndex]; 
    const targetCategory = categories[targetCategoryIndex];

    if (targetCategory.items.some((item) => item.id === dragItem.id)) {
      return;
    }

    const sourceItemIndex = sourceCategory.items.findIndex((item) => item.id === dragItem.id);
    const sourceItem = sourceCategory.items[sourceItemIndex];
    const sourceDescendants = findDescendants(sourceCategory.items, sourceItemIndex);
    const items = [sourceItem, ...sourceDescendants].map((item) => ({ ...item, categoryId: targetCategory.id }));
    
    setCategories(update(categories, {
      [sourceCategoryIndex]: {
        items: { $set: remove(sourceCategory.items, sourceItemIndex) },
      },
      [targetCategoryIndex]: { 
        items: { $set: add(targetCategory.items, items) } 
      },
    }));
    console.log('finalItems',categories)

  };
  // console.log('categores', CATEGORIES)
  return (
    <Flipper flipKey={categories.map(({ items }) => items.map(({ id }) => id).join('.')).join('.')}>
      <div style={{display: 'flex'}}>
      {categories.map(({ id, name, items }, index) => {
        console.log('Itemmms', name)
          return (
            <div style={{flexGrow:1}}>                 
            <Box 
            key={id}
            width={isLargeScreen ? `${100 / categories.length}%` : undefined} 
            pr={{ md: index < categories.length - 1 ? 4 : 0 }}
            mb={4}
            style={{width:300}}
          >
            <h5>{name}</h5>
            <Tree
              id={id}
              items={items}
              onChange={handleChange(index)}
              onEnter={handleEnter(index)}
            />
          </Box>
           
        </div>
          )
        })
      }

      </div>
      <button onClick={onsubmit}>Save</button>
    </Flipper>
  );
};

export default MultipleTree;



// import React from 'react';
// import { Flipper } from 'react-flip-toolkit';
// import { Box, Typography } from '@material-ui/core';
// import faker from 'faker/locale/en';
// import update from 'immutability-helper';
// import { useDrop } from 'react-dnd';

// import Sortly, { ItemData, DragObject, add, remove, findDescendants } from 'react-sortly';
// import DefaultItemRenderer from './DefaultItemRenderer';
// import useScreenSize from './useScreenSize';

// type Item = {
//   categoryId: number;
//   name: string;
// };

// let idSeq = 0;
// const generate = (numItems: number, categoryId: number): ItemData<Item>[] => (
//   Array
//     .from(Array(numItems).keys())
//     .map(() => {
//       idSeq += 1;
//       return {
//         id: idSeq,
//         categoryId,
//         name: faker.name.findName(),
//         depth: 0,
//       };
//     })
// );

// const CATEGORIES = Array.from(Array(3).keys()).map((data, index) => 
// ({
//   id: index + 1,
//   name: faker.address.country(),
//   items: generate(5, index + 1),
// }));


// const CATEGORIES2 = [
//   {
//     id: 1,
//     name: "Semster 1",
//     items: [
//       {id:1,categoryId: 1, name: "Miss Dangelo Bailey", depth: 0},
//       {id:2,categoryId: 1, name: "Miss Dangelo Bailey", depth: 0}    
//     ]
//   },
//   {
//     id: 2,
//     name: "Semster 2",
//     items: [
//       {id:2,categoryId: 2, name: "Miss Dangelo Bailey", depth: 0},
//       {id:3,categoryId: 2, name: "Miss Dangelo Bailey", depth: 0}    
//     ]
//   },
//   {
//     id: 3,
//     name: "Semster 3",
//     items: [
//       {id:4,categoryId: 3, name: "Miss Dangelo Bailey", depth: 0},
//       {id:5,categoryId: 3, name: "Miss Dangelo Bailey", depth: 0}    
//     ]
//   }
// ]

// type TreeProps = {
//   id: number;
//   items: ItemData<Item>[]; 
//   onChange: (items: ItemData<Item>[]) => void;
//   onEnter: (item: DragObject) => void;
// };
// const Tree = ({ items, onChange, onEnter }: TreeProps) => {
//   const [{ hovered, dragItem }, drop] = useDrop({
//     accept: 'TREE',
//     collect: (monitor) => ({
//       hovered: monitor.isOver(),
//       dragItem: monitor.getItem(),
//     }),
//   });

//   const handleMove = React.useCallback(() => {
//     if (!dragItem) {
//       return;
//     }

//     if (hovered) {
//       onEnter(dragItem);
//     }
//   }, [dragItem, hovered, onEnter]);

//   React.useEffect(() => {
//     if (dragItem) {
//       handleMove();
//     }
//   }, [dragItem, hovered, handleMove]);

//   return (
//     <div ref={drop} style={{ paddingBottom: 50 }}>
//       <Sortly<Item>
//         type="TREE"
//         items={items}
//         onChange={onChange}
//       >
//         {DefaultItemRenderer}
//       </Sortly>
//     </div>
//   );
// };

// const MultipleTree = () => {
//   const { isLargeScreen } = useScreenSize();
//   const [categories, setCategories] = React.useState(CATEGORIES2);
//   const handleChange = (index: number) => (newItems: ItemData<Item>[]) => 
//   {
//     console.log(newItems)
//     setCategories(update(categories, {
//       [index]: { items: { $set: newItems } },
//     }));
//   };
//   const handleEnter = (targetCategoryIndex: number) => (dragItem: DragObject) => {
//     const sourceCategoryIndex = categories.findIndex((category) => (
//       category.items.some((item) => item.id === dragItem.id)
//     ));
//     const sourceCategory = categories[sourceCategoryIndex]; 
//     const targetCategory = categories[targetCategoryIndex];

//     if (targetCategory.items.some((item) => item.id === dragItem.id)) {
//       return;
//     }

//     const sourceItemIndex = sourceCategory.items.findIndex((item) => item.id === dragItem.id);
//     const sourceItem = sourceCategory.items[sourceItemIndex];
//     const sourceDescendants = findDescendants(sourceCategory.items, sourceItemIndex);
//     const items = [sourceItem, ...sourceDescendants].map((item) => ({ ...item, categoryId: targetCategory.id }));

//     setCategories(update(categories, {
//       [sourceCategoryIndex]: {
//         items: { $set: remove(sourceCategory.items, sourceItemIndex) },
//       },
//       [targetCategoryIndex]: { 
//         items: { $set: add(targetCategory.items, items) } 
//       },
//     }));
//   };
//   console.log('categores', CATEGORIES)
//   return (
//     <Flipper flipKey={categories.map(({ items }) => items.map(({ id }) => id).join('.')).join('.')}>
//       <Box display={{ md: 'flex' }}>
//         {categories.map(({ id, name, items }, index) => (
//           <Box 
//             key={id}
//             width={isLargeScreen ? `${100 / categories.length}%` : undefined} 
//             pr={{ md: index < categories.length - 1 ? 4 : 0 }}
//             mb={4}
//           >
//             <Typography variant="h5" gutterBottom>{name}</Typography>
//             <Tree
//               id={id}
//               items={items}
//               onChange={handleChange(index)}
//               onEnter={handleEnter(index)}
//             />
//           </Box>
//         ))}
//       </Box>
//     </Flipper>
//   );
// };

// export default MultipleTree;

