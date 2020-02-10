import React from "react";
import { Flipper } from "react-flip-toolkit";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import faker from "faker/locale/en";
import update from "immutability-helper";
import { useDrop } from "react-dnd";

import Sortly, {
  ItemData,
  DragObject,
  add,
  remove,
  findDescendants
} from "react-sortly";
import DefaultItemRenderer from "./DefaultItemRenderer";
import useScreenSize from "./useScreenSize";

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
    name: "Course",
    items: [
      {
        id: 1,
        categoryId: 1,
        name: "Basic Circuit Theory Network analysis",
        depth: 0
      },
      {
        id: 2,
        categoryId: 1,
        name: "Basic Circuit Theory Network analysis",
        depth: 0
      },
      {
        id: 3,
        categoryId: 1,
        name: "Basic Circuit Theory Network analysis",
        depth: 0
      },
      {
        id: 4,
        categoryId: 1,
        name: "Basic Circuit Theory Network analysis",
        depth: 0
      }
    ]
  },
  {
    id: 2,
    name: "Semster 1",
    items: [
      // {id:3,categoryId: 2, name: "Miss Dangelo Bailey", depth: 0},
      // {id:4,categoryId: 2, name: "Miss Dangelo Bailey", depth: 0}
    ]
  },
  {
    id: 3,
    name: "Semster 2",
    items: [
      // {id:4,categoryId: 3, name: "Miss Dangelo Bailey", depth: 0},
      // {id:5,categoryId: 3, name: "Miss Dangelo Bailey", depth: 0}
    ]
  },
  {
    id: 4,
    name: "Semster 3",
    items: []
  },
  {
    id: 5,
    name: "Semster 4",
    items: []
  },
  {
    id: 6,
    name: "Semster 5",
    items: []
  },
  {
    id: 6,
    name: "Semster 6",
    items: []
  }
];

const Tree = ({ id, items, onChange, onEnter }) => {
  const [{ hovered, dragItem }, drop] = useDrop({
    accept: "TREE",
    collect: monitor => ({
      hovered: monitor.isOver(),
      dragItem: monitor.getItem()
    })
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
      <Sortly type="TREE" items={items} onChange={onChange}>
        {DefaultItemRenderer}
      </Sortly>
    </div>
  );
};

const MultipleTree = () => {
  const onsubmit = () => {
    console.log("clicked", categories);
  };
  const { isLargeScreen } = useScreenSize();
  const [categories, setCategories] = React.useState(CATEGORIES2);
  const handleChange = index => newItems => {
    setCategories(
      update(categories, {
        [index]: { items: { $set: newItems } }
      })
    );
  };
  const handleEnter = targetCategoryIndex => dragItem => {
    const sourceCategoryIndex = categories.findIndex(category =>
      category.items.some(item => item.id === dragItem.id)
    );
    const sourceCategory = categories[sourceCategoryIndex];
    const targetCategory = categories[targetCategoryIndex];

    if (targetCategory.items.some(item => item.id === dragItem.id)) {
      return;
    }

    const sourceItemIndex = sourceCategory.items.findIndex(
      item => item.id === dragItem.id
    );
    const sourceItem = sourceCategory.items[sourceItemIndex];
    const sourceDescendants = findDescendants(
      sourceCategory.items,
      sourceItemIndex
    );
    const items = [sourceItem, ...sourceDescendants].map(item => ({
      ...item,
      categoryId: targetCategory.id
    }));

    setCategories(
      update(categories, {
        [sourceCategoryIndex]: {
          items: { $set: remove(sourceCategory.items, sourceItemIndex) }
        },
        [targetCategoryIndex]: {
          items: { $set: add(targetCategory.items, items) }
        }
      })
    );
    console.log("finalItems", categories);
  };
  // console.log('categores', CATEGORIES)
  return (
    <Flipper
      flipKey={categories
        .map(({ items }) => items.map(({ id }) => id).join("."))
        .join(".")}
    >
      <div>
        {/* {categories.map(({ id, name, items }, index) => {
          console.log("Itemmms", name);
          id = id + 1;
          return (
            <div style={{ flexGrow: 1 }}>
              <Box
                key={id}
                width={
                  isLargeScreen ? `${100 / categories.length}%` : undefined
                }
                pr={{ md: index < categories.length - 1 ? 4 : 0 }}
                mb={4}
                style={{ width: 300 }}
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
          );
        })} */}
        <div>
          <div className="row">
            <div
              className="col col-lg-4"
              style={{
                backgroundColor: "rgb(234, 234, 234)",
                marginLeft: 43,
                marginTop: 40,
                width: "452px",
                height: "320px",
                borderRadius: "8px",
                border: "solid 1px #3d3a67"
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <Box
                  key={1}
                  width={
                    isLargeScreen ? `${100 / categories.length}%` : undefined
                  }
                  pr={{ md: 1 < categories.length - 1 ? 4 : 0 }}
                  mb={4}
                  style={{ width: "100%" }}
                >
                  <div id="textbox">
                    <p
                      className="alignleft"
                      style={{ float: "left", fontSize: 20, fontWeight: 600 }}
                    >
                      {categories[1].name}
                    </p>
                    <p
                      className="alignright"
                      style={{
                        float: "right",
                        color: "cornflowerblue",
                        fontWeight: 600,
                        fontSize: 19
                      }}
                    >
                      Credits
                    </p>
                  </div>
                  <div style={{ clear: "both" }}></div>

                  <Tree
                    id={1}
                    items={categories[1].items}
                    onChange={handleChange(1)}
                    onEnter={handleEnter(1)}
                  />
                </Box>
              </div>
            </div>
            <div
              className="col col-lg-4"
              style={{
                backgroundColor: "rgb(234, 234, 234)",
                marginLeft: 43,
                marginTop: 40,
                width: "452px",
                height: "320px",
                borderRadius: "8px",
                border: "solid 1px #3d3a67"
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <Box
                  key={2}
                  width={
                    isLargeScreen ? `${100 / categories.length}%` : undefined
                  }
                  pr={{ md: 2 < categories.length - 1 ? 4 : 0 }}
                  mb={4}
                  style={{ width: "100%" }}
                >
                  <div id="textbox">
                    <p
                      className="alignleft"
                      style={{ float: "left", fontSize: 20, fontWeight: 600 }}
                    >
                      {categories[1].name}
                    </p>
                    <p
                      className="alignright"
                      style={{
                        float: "right",
                        color: "cornflowerblue",
                        fontWeight: 600,
                        fontSize: 19
                      }}
                    >
                      Credits
                    </p>
                  </div>
                  <div style={{ clear: "both" }}></div>
                  <Tree
                    id={1}
                    items={categories[2].items}
                    onChange={handleChange(2)}
                    onEnter={handleEnter(2)}
                  />
                </Box>
              </div>
            </div>
          </div>
          <div className="row">
            <div
              className="col col-lg-4"
              style={{
                backgroundColor: "rgb(234, 234, 234)",
                marginLeft: 43,
                marginTop: 40,
                width: "452px",
                height: "320px",
                borderRadius: "8px",
                border: "solid 1px #3d3a67"
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <Box
                  key={3}
                  width={
                    isLargeScreen ? `${100 / categories.length}%` : undefined
                  }
                  pr={{ md: 3 < categories.length - 1 ? 4 : 0 }}
                  mb={4}
                  style={{ width: "100%" }}
                >
                  <div id="textbox">
                    <p
                      className="alignleft"
                      style={{ float: "left", fontSize: 20, fontWeight: 600 }}
                    >
                      {categories[1].name}
                    </p>
                    <p
                      className="alignright"
                      style={{
                        float: "right",
                        color: "cornflowerblue",
                        fontWeight: 600,
                        fontSize: 19
                      }}
                    >
                      Credits
                    </p>
                  </div>
                  <div style={{ clear: "both" }}></div>
                  <Tree
                    id={1}
                    items={categories[3].items}
                    onChange={handleChange(3)}
                    onEnter={handleEnter(3)}
                  />
                </Box>
              </div>
            </div>
            <div
              className="col col-lg-4"
              style={{
                backgroundColor: "rgb(234, 234, 234)",
                marginLeft: 43,
                marginTop: 40,
                width: "452px",
                height: "320px",
                borderRadius: "8px",
                border: "solid 1px #3d3a67"
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <Box
                  key={4}
                  width={
                    isLargeScreen ? `${100 / categories.length}%` : undefined
                  }
                  pr={{ md: 4 < categories.length - 1 ? 4 : 0 }}
                  mb={4}
                  style={{ width: "100%" }}
                >
                  <div id="textbox">
                    <p
                      className="alignleft"
                      style={{ float: "left", fontSize: 20, fontWeight: 600 }}
                    >
                      {categories[1].name}
                    </p>
                    <p
                      className="alignright"
                      style={{
                        float: "right",
                        color: "cornflowerblue",
                        fontWeight: 600,
                        fontSize: 19
                      }}
                    >
                      Credits
                    </p>
                  </div>
                  <div style={{ clear: "both" }}></div>
                  <Tree
                    id={1}
                    items={categories[4].items}
                    onChange={handleChange(4)}
                    onEnter={handleEnter(4)}
                  />
                </Box>
              </div>
            </div>
          </div>
          <div
            className="col col-lg-4"
            style={{
              position: "absolute",
              left: "1013px",
              top: 37,
              width: 296,
              height: 677,
              borderRadius: 8,
              backgroundColor: "lightblue"
            }}
          >
            <div style={{ flexGrow: 1 }}>
              <Box
                key={0}
                width={
                  isLargeScreen ? `${100 / categories.length}%` : undefined
                }
                pr={{ md: 0 < categories.length - 1 ? 4 : 0 }}
                mb={4}
                style={{ width: 300 }}
              >
                <h5>{categories[0].name} list</h5>
                <Tree
                  id={0}
                  items={categories[0].items}
                  onChange={handleChange(0)}
                  onEnter={handleEnter(0)}
                />
              </Box>
            </div>
          </div>
          <button
            onClick={onsubmit}
            className="btn btn-primary"
            style={{ position: "absolute", left: "1013px", width: "296px" }}
          >
            Save
          </button>
        </div>
      </div>
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
