export default ({ dirname, path }) => ({
  resolve: {
    alias: {
      '~': path.resolve(dirname, 'src'),
    },
  },
});
