import { fetchBooks, deleteBook } from "@/api/books";
import { Button } from "@/components/ui/button";
import {
  useQueryClient,
  useSuspenseQuery,
  useMutation,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

export const Route = createFileRoute("/i18n/")({
  component: RouteComponent,
});

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      en: {
      translation: {
        ID: "ID",
        ISBN: "ISBN",
        TITLE: "Title",
        AUTHOR: "Author",
        YEAR: "Year",
        GENRE: "Genre",
        PAGES: "Pages",
        DELETE: "Delete",
        PAGE_NO_one: "{{count}} page",
        PAGE_NO_other: "{{count}} pages"
      },
      },
      de: {
      translation: {
        ID: "ID",
        ISBN: "ISBN",
        TITLE: "Titel",
        AUTHOR: "Autor",
        YEAR: "Jahr",
        GENRE: "Genre",
        PAGES: "Seiten",
        DELETE: "Löschen",
        PAGE_NO_one: "{{count}} Seite",
        PAGE_NO_other: "{{count}} Seiten"
      },
      },
    },
    lng: "en", // if you're using a language detector, do not define the lng option
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    },
  });

function RouteComponent() {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: books } = useSuspenseQuery({
    queryKey: ["books"],
    queryFn: fetchBooks,
  });

  const mutation = useMutation({
    mutationFn: deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  if (!books || books.length === 0) {
    return <div>No books found</div>;
  }

  return (
    <>
      <div>
        <Button
          onClick={() => i18n.changeLanguage("de")}
          disabled={i18n.language === "de"}
        >
          de
        </Button>
        <Button
          onClick={() => i18n.changeLanguage("en")}
          disabled={i18n.language === "en"}
        >
          en
        </Button>
      </div>
      <table>
        <thead>
          <tr>
            <th>{t("ID")}</th>
            <th>{t("ISBN")}</th>
            <th>{t("TITLE")}</th>
            <th>{t("AUTHOR")}</th>
            <th>{t("YEAR")}</th>
            <th>{t("GENRE")}</th>
            <th>{t("PAGES")}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.id}</td>
              <td>{book.isbn}</td>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publishedYear}</td>
              <td>{book.genre}</td>
              <td>{t('PAGE_NO', {count: book.pages})}</td>
              <td>
                <button onClick={() => mutation.mutate(book.id)}>
                  {t("DELETE")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
