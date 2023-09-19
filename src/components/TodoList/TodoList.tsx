import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import {
  Todo,
  removeTodo,
  toggleTodo,
  Status,
} from '../../redux/todosSlice';
import { saveTodosState } from '../../utils/db';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Collapse,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { TransitionGroup } from 'react-transition-group';

const TodoList = () => {
  const todos = useSelector((state: RootState) => state.todosList.todos);
  const status = useSelector((state: RootState) => state.todosList.status);

  const sortedTodos = useMemo(() => {
    return todos.slice().sort((a:Todo, b:Todo) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [todos]);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (status === Status.SUCCEEDED) {
      saveTodosState(todos);
    }
  }, [todos]);

  const handleDelete = (id: string) => {
    dispatch(removeTodo(id));
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTodo(id));
  };

  return (
    <List sx={{ width: '100%', maxHeight: '50vh', overflowY: 'auto' }}>
      <TransitionGroup>
        {sortedTodos.map((todo: Todo) => (
          <Collapse in={true} timeout='auto' unmountOnExit key={todo.id}>
            <ListItem key={todo.id}>
              <Checkbox
                edge='start'
                checked={todo.completed}
                tabIndex={-1}
                onClick={() => handleToggle(todo.id)}
              />
              <ListItemText
                primary={todo.text}
                sx={{
                  opacity: todo.completed ? 0.5 : 1,
                  transition: 'opacity 0.3s',
                }}
              />
              <ListItemSecondaryAction>
                <IconButton edge='end' onClick={() => handleDelete(todo.id)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Collapse>
        ))}
      </TransitionGroup>
    </List>
  );
};

export default TodoList;
