import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Önce localStorage'ı temizle
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");

      console.log("Giriş denemesi:", { email: data.email });

      const response = await axios.post("http://localhost:8080/api/users/login", {
        email: data.email,
        password: data.password,
      });

      console.log("Sunucu yanıtı:", response.data);

      if (response.data && response.data.token && response.data.user) {
        // Token'ı jwtToken olarak kaydet (Bearer prefix'i olmadan)
        const token = response.data.token;
        console.log("Saving token:", token); // Debug için
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setSuccessMessage("Giriş başarılı! Hoş geldiniz.");
        
        // Token'ın kaydedildiğini kontrol et
        const savedToken = localStorage.getItem("jwtToken");
        console.log("Saved token check:", savedToken); // Debug için
        
        // Kullanıcı rolüne göre yönlendirme
        if (response.data.user.role === "ADMIN") {
          setTimeout(() => navigate("/admin"), 1500);
        } else {
          setTimeout(() => navigate("/"), 1500);
        }
      } else {
        setErrorMessage("Giriş başarısız. Lütfen tekrar deneyin.");
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      if (error.response) {
        // Sunucudan gelen hata mesajını göster
        const errorMessage = error.response.data.message || "Giriş başarısız. Lütfen tekrar deneyin.";
        setErrorMessage(errorMessage);
        
        // Token ile ilgili hatalarda localStorage'ı temizle
        if (error.response.status === 401) {
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("user");
        }
      } else if (error.request) {
        // İstek yapıldı ama yanıt alınamadı
        setErrorMessage("Sunucuya bağlanılamıyor. Lütfen daha sonra tekrar deneyin.");
      } else {
        // İstek oluşturulurken hata oluştu
        setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
      }
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('https://www.pixelstalk.net/wp-content/uploads/images6/GYM-Fitness-Wallpaper-HD.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="position-absolute top-0 start-0 m-3 d-flex align-items-center p-2 rounded">
        <img
          src="/images/image1.png"
          alt="Salon Logo"
          className="me-2"
          style={{ width: "150px", height: "150px", objectFit: "contain" }}
        />
      </div>
      <div className="bg-transparent p-5 rounded shadow-sm w-50 w-md-50">
        <h2 className="text-center mb-4 text-white">Giriş Yap</h2>

        {successMessage && (
          <p className="text-success text-center mb-4">{successMessage}</p>
        )}

        {errorMessage && (
          <p className="text-danger text-center mb-4">{errorMessage}</p>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group controlId="email">
            <Form.Label className="text-white">E-posta</Form.Label>
            <Form.Control
              type="email"
              {...register("email", {
                required: "E-posta zorunludur",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Geçerli bir e-posta girin",
                },
              })}
              isInvalid={errors.email}
            />
            {errors.email && (
              <Form.Control.Feedback type="invalid">
                {errors.email.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label className="text-white">Şifre</Form.Label>
            <Form.Control
              type="password"
              {...register("password", {
                required: "Şifre zorunludur",
              })}
              isInvalid={errors.password}
            />
            {errors.password && (
              <Form.Control.Feedback type="invalid">
                {errors.password.message}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Button type="submit" className="w-100 mt-4" variant="primary">
            Giriş Yap
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
