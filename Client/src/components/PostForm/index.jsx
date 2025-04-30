import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from './../Button';

export default function PostForm({ post, onSave }) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (post?.image && typeof post.image === 'string') {
      setPreview(post.image); // si ya tiene una imagen al editar
    }
  }, [post]);

  const initialValues = {
    title: post?.title || '',
    content: post?.content || '',
    image: null,
  };

  const validationSchema = Yup.object({
    title: Yup.string().optional(),
    content: Yup.string().optional(),
    image: Yup.mixed().optional(),
  });

  return (
    <div className="bg-white rounded-2xl p-6 max-w-3xl w-full mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        {post ? 'Editar Publicación' : 'Crear Publicación'}
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSave}
      >
        {({ setFieldValue, isSubmitting }) => (
          <Form className="space-y-4">
            {preview && (
              <div className="flex justify-center mt-4">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="w-40 h-40 object-cover rounded-md border"
                />
              </div>
            )}

            <div>
              <label htmlFor="image" className="block font-medium mb-1">Imagen</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                className="block w-full border p-2 rounded"
                onChange={(e) => {
                  const file = e.currentTarget.files[0];
                  setFieldValue('image', file);
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              <ErrorMessage name="image" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="title" className="block font-medium">Título</label>
              <Field name="title" className="w-full border p-2 rounded" />
              <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
            </div>

            <div>
              <label htmlFor="content" className="block font-medium">Contenido</label>
              <Field as="textarea" name="content" className="w-full border p-2 rounded" />
              <ErrorMessage name="content" component="div" className="text-red-500 text-sm" />
            </div>

            


            <div className="flex justify-center">
              <Button type="submit" disabled={isSubmitting } className='p-4'>
                {post ? 'Actualizar' : 'Publicar'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
