import { useFormik } from "formik";
import { FC } from "react";

import { Button } from "antd";
import "./sign-in.scss";
import Icon from "components/Icon/Icon";
import Input from "components/Input/Input";

const SignIn: FC = () => {
  const form = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values: any) => {
      const errors: Record<string, string> = {};
      if (!values.email) {
        errors.email = "Required field";
      }
      if (!values.password) {
        errors.password = "Required field";
      }

      return errors;
    },
    onSubmit: async (values: any) => {
      console.log("values", values);
    },
  });

  return (
    <div className="signin w-screen h-screen flex flex-col md:grid md:grid-cols-2">
      <div className="w-full h-full flex flex-col gap-6 items-center justify-start py-20 md:py-0 md:justify-center">
        <img src="/logo.svg" alt="Logo" width={300} className="logo" />
        <div className="max-w-[500px] flex flex-col gap-3 w-[90%]">
          <div className="signin-title">Sign in to Replenishment</div>
          <p className="signin-subtitle">Manage your business smarter.</p>
          <div>
            <Input
              label="Email"
              prefix={<Icon className="mr-2" icon="sms" size={24} />}
              autoFocus
              {...form.getFieldProps("email")}
              status={!!form.errors.email ? "error" : undefined}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter") {
              //     form.handleSubmit();
              //   }
              // }}
            />
            <div className="h-[30px] text-[12px] pt-1 text-red-500">
              {form.errors.email}
            </div>
            <Input
              label="Mật khẩu"
              type="password"
              prefix={<Icon className="mr-2" icon="lock" size={24} />}
              placeholder="Password"
              {...form.getFieldProps("password")}
              status={!!form.errors.email ? "error" : undefined}
              // iconRender={(visible) =>
              //   visible ? (
              //     <Icon icon="eye-slash" size={24} color="#d9d9d9" />
              //   ) : (
              //     <Icon icon="eye" size={24} color="#d9d9d9" />
              //   )
              // }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  form.handleSubmit();
                }
              }}
            />
            <div className="h-[30px]  text-[12px] pt-1 text-red-500">
              {form.errors.password}
            </div>
          </div>
          <Button
            type="primary"
            loading={form.isSubmitting}
            onClick={() => form.handleSubmit()}
            style={{ fontSize: 20, height: 56, fontWeight: 700 }}
          >
            Sign In
          </Button>
        </div>
      </div>
      <div className="slide-peak relative overflow-hidden max-h-[250px] md:max-h-screen">
        <div className="context px-20 text-[30px] md:text-[40px] xl:text-[50px] flex flex-col gap-10">
          <img src="/signin-image.svg" width="90%" className="grow" />
          <h1 className="slide-peak-title">Get better in stock management</h1>
          <p className="slide-peak-content">
            Replenishment helps you intergrate easily with your business
            systems, streamlining your operations and saving you time and money.
            Say goodbye to manual inventory tracking and hello to effortless
            management with our innovative software.
          </p>
        </div>
        <div className="area">
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
