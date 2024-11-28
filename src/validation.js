document.querySelector('#num_format').addEventListener("change", function() { change_imp(); });

// function set_input_text(e, field) {
//   e.preventDefault();

//   const qField = document.getElementById(field);
//   let valid = true;

//   if (qField.value == "ma") {
//     document.getElementById("s11_re_label").textContent = "S11 Magnitude";
//     document.getElementById("s11_im_label").textContent = "S11 Angle (deg)";
//     document.getElementById("s12_re_label").textContent = "S12 Magnitude";
//     document.getElementById("s12_im_label").textContent = "S12 Angle (deg)";
//     document.getElementById("s21_re_label").textContent = "S21 Magnitude";
//     document.getElementById("s21_im_label").textContent = "S21 Angle (deg)";
//     document.getElementById("s22_re_label").textContent = "S22 Magnitude";
//     document.getElementById("s22_im_label").textContent = "S22 Angle (deg)";
//   } else if (qField.value  == "db") {
//     document.getElementById("s11_re_label").textContent = "S11 Magnitude (dB)";
//     document.getElementById("s11_im_label").textContent = "S11 Angle (deg)";
//     document.getElementById("s12_re_label").textContent = "S12 Magnitude (dB)";
//     document.getElementById("s12_im_label").textContent = "S12 Angle (deg)";
//     document.getElementById("s21_re_label").textContent = "S21 Magnitude (dB)";
//     document.getElementById("s21_im_label").textContent = "S21 Angle (deg)";
//     document.getElementById("s22_re_label").textContent = "S22 Magnitude (dB)";
//     document.getElementById("s22_im_label").textContent = "S22 Angle (deg)";
//   }else {
//     document.getElementById("s11_re_label").textContent = "S11 Real";
//     document.getElementById("s11_im_label").textContent = "S11 Imaginary";
//     document.getElementById("s12_re_label").textContent = "S12 Real";
//     document.getElementById("s12_im_label").textContent = "S12 Imaginary";
//     document.getElementById("s21_re_label").textContent = "S21 Real";
//     document.getElementById("s21_im_label").textContent = "S21 Imaginary";
//     document.getElementById("s22_re_label").textContent = "S22 Real";
//     document.getElementById("s22_im_label").textContent = "S22 Imaginary";
//   }
//   return valid;
// }
function validate_sparm(e, field) {
  e.preventDefault();

  const qField = document.getElementById(field);
  let valid = true;

  if (!/^-?0+(\.[0-9]*)?$/.test(qField.value)) {
    qField.classList.add("is-invalid");
    qField.classList.remove("is-valid");
  } else {
    qField.classList.add("is-valid");
    qField.classList.remove("is-invalid");
  }
  return valid;
}
function validate_positive(e, field) {
  e.preventDefault();

  const qField = document.getElementById(field);
  let valid = true;

  if (!/^[0-9]+(\.[0-9]*)?$/.test(qField.value)) {
    qField.classList.add("is-invalid");
    qField.classList.remove("is-valid");
  } else {
    qField.classList.add("is-valid");
    qField.classList.remove("is-invalid");
  }
  return valid;
}
function validate_number(e, field) {
  e.preventDefault();

  const qField = document.getElementById(field);
  let valid = true;

  if (!/^-?[0-9]+(\.[0-9]*)?$/.test(qField.value)) {
    qField.classList.add("is-invalid");
    qField.classList.remove("is-valid");
  } else {
    qField.classList.add("is-valid");
    qField.classList.remove("is-invalid");
  }
  return valid;
}

// const number_format = document.getElementById("num_format");
// number_format.addEventListener('focusout', (e) => set_input_text(e, "num_format"));

const s11re = document.getElementById("s11_re");
s11re.addEventListener('focusout', (e) => validate_number(e, "s11_re"));
const s11im = document.getElementById("s11_im");
s11im.addEventListener('focusout', (e) => validate_number(e, "s11_im"));

const s12re = document.getElementById("s12_re");
s12re.addEventListener('focusout', (e) => validate_number(e, "s12_re"));
const s12im = document.getElementById("s12_im");
s12im.addEventListener('focusout', (e) => validate_number(e, "s12_im"));

const s21re = document.getElementById("s21_re");
s21re.addEventListener('focusout', (e) => validate_number(e, "s21_re"));
const s21im = document.getElementById("s21_im");
s21im.addEventListener('focusout', (e) => validate_number(e, "s21_im"));

const s22re = document.getElementById("s22_re");
s22re.addEventListener('focusout', (e) => validate_number(e, "s22_re"));
const s22im = document.getElementById("s22_im");
s22im.addEventListener('focusout', (e) => validate_number(e, "s22_im"));
