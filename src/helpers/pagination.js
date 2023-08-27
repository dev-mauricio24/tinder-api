export const paginator = (count, page, size) => {

  const totalPage = Math.ceil(count / size);
  const currentPage = page;
  const previous = currentPage === 1 ? null : currentPage - 1
  const next = currentPage === totalPage ? null : currentPage + 1

  return {
    count,
    totalPage,
    currentPage,
    size,
    previous,
    next
  }
}