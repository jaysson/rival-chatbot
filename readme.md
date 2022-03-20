# Rival ChatBot Challenge

```sh
yarn
# Run with ts-node
yarn start:dev -e your-email -n name

# Or, you can build and run the JS version
yarn build
yarn start -e your-email -n name
```

## Todo

- [ ] Exponential backoffs and maximum number of retries for API calls
- [ ] Derive applicable solvers based on the challenge sections (numeric, word, data)
- [ ] Add tests
- [ ] Better solver matching using natural language processing. Current `text.includes` matching is quite pedestrian
