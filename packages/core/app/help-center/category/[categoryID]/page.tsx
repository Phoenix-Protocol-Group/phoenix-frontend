interface CategoryPageProps {
  readonly params: {
    readonly categoryId: string;
  };
}

export default function Page({ params }: CategoryPageProps) {
  return (
    <div>
      <h1>Category {params.categoryId}</h1>
    </div>
  );
}
