import React, { Component } from 'react';

// styles
import styles from './style.scss';

//components
import FormItem from './form_item';

//vendor components
import ReactPhoneInput from 'react-phone-input-2';
import Select from 'react-select';

import '../../../stylesheets/custom_select.scss';

//constants
const REGIONS_BY_PHONE_INPUT = ['europe'];
const DEFAULT_COUNTRY = 'ru';
const PHONE_INPUT_STYLE = {
  width: '100%',
  borderRadius: '3px',
  border: '1px #ccc solid',
  height: '39px',
  fontSize: '13px',
  color: '#707067',
};
const PROFESSION_OPTIONS = [
  { id: '1', label: 'Адвокат' },
  { id: '2', label: 'Генеральный секретарь' },
  { id: '3', label: 'Делопроизводитель' },
  { id: '4', label: 'Детектив' },
  { id: '5', label: 'Дипломат' },
  { id: '6', label: 'Конвоир' },
  { id: '7', label: 'Милиционер' },
  { id: '8', label: 'Министр' },
  { id: '9', label: 'Нотариус' },
  { id: '10', label: 'Охранник' },
  { id: '11', label: 'Полицейский' },
  { id: '12', label: 'Следователь' },
];

// class
class MainForm extends Component {
  state = {
    phone: '',
    name: '',
    surName: '',
    profession: '',
  };

  handleChangePhone = phone => {
    this.setState({ phone });
  };

  handleInput = e => {
    const { value, name } = e.target;

    this.setState({ [name]: value });
  };

  handleChangeProfession = profession => {
    this.setState({ profession });
  };

  render() {
    const { phone, name, surName, profession } = this.state;

    return (
      <div className={styles.alignBox}>
        <div className={styles.formBox}>
          <div className={styles.formTitle}>
            <strong>Зарегестрируйтесь</strong> и начните продавать услуги через
            интернет сегодня
          </div>

          <div className={styles.mainForm}>
            <div className={styles.horisontalItem}>
              <FormItem title="Имя">
                <input
                  className={styles.customInput}
                  type="text"
                  name="name"
                  value={name}
                  onChange={this.handleInput}
                />
              </FormItem>

              <FormItem title="Фамилия">
                <input
                  className={styles.customInput}
                  type="text"
                  name="surName"
                  value={surName}
                  onChange={this.handleInput}
                />
              </FormItem>
            </div>

            <FormItem title="Профессия">
              <Select
                name="profession"
                value={profession}
                onChange={this.handleChangeProfession}
                options={PROFESSION_OPTIONS}
              />
            </FormItem>

            <FormItem title="Телефон">
              <ReactPhoneInput
                defaultCountry={DEFAULT_COUNTRY}
                regions={REGIONS_BY_PHONE_INPUT}
                inputStyle={PHONE_INPUT_STYLE}
                onChange={this.handleChangePhone}
                value={phone}
              />
            </FormItem>
          </div>

          <button className={styles.blueBtn}>
            Зарегестрироваться
          </button>
        </div>
      </div>
    );
  }
}

export default MainForm;
